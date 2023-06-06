# import the necessary packages

import numpy as np
import time
import base64
import json
import cv2
import psycopg2
import boto3
from urllib.parse import urlparse
# construct the argument parse and parse the arguments
confthres = 0.3
nmsthres = 0.1



def get_labels(labels_path):
    # load the COCO class labels our YOLO model was trained on
    with open(labels_path, 'r') as f:
        LABELS = f.read().strip().split("\n")
    return LABELS

def get_weights_config(weights_path, config_path):
    return weights_path, config_path

def load_model(configpath,weightspath):
    # load our YOLO object detector trained on COCO dataset (80 classes)
    print("[INFO] loading YOLO from disk...")
    net = cv2.dnn.readNetFromDarknet(configpath, weightspath)
    return net



def do_prediction(image,net,LABELS, uuid):
    print("doing prediction.... ")
    
    (H, W) = image.shape[:2]
    # determine only the *output* layer names that we need from YOLO
    ln = net.getLayerNames()
    ln = [ln[i - 1] for i in net.getUnconnectedOutLayers()]

    # construct a blob from the input image and then perform a forward
    # pass of the YOLO object detector, giving us our bounding boxes and
    # associated probabilities
    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416),
                                 swapRB=True, crop=False)
    net.setInput(blob)
    start = time.time()
    layerOutputs = net.forward(ln)
    #print(layerOutputs)
    end = time.time()

    # show timing information on YOLO
    print("[INFO] YOLO took {:.6f} seconds".format(end - start))

    # initialize our lists of detected bounding boxes, confidences, and
    # class IDs, respectively
    boxes = []
    confidences = []
    classIDs = []

    # loop over each of the layer outputs
    for output in layerOutputs:
        # loop over each of the detections
        for detection in output:
            # extract the class ID and confidence (i.e., probability) of
            # the current object detection
            scores = detection[5:]
            # print(scores)
            classID = np.argmax(scores)
            # print(classID)
            confidence = scores[classID]

            # filter out weak predictions by ensuring the detected
            # probability is greater than the minimum probability
            if confidence > confthres:
                # scale the bounding box coordinates back relative to the
                # size of the image, keeping in mind that YOLO actually
                # returns the center (x, y)-coordinates of the bounding
                # box followed by the boxes' width and height
                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")

                # use the center (x, y)-coordinates to derive the top and
                # and left corner of the bounding box
                x = int(centerX - (width / 2))
                y = int(centerY - (height / 2))

                # update our list of bounding box coordinates, confidences,
                # and class IDs
                boxes.append([x, y, int(width), int(height)])

                confidences.append(float(confidence))
                classIDs.append(classID)

    # apply non-maxima suppression to suppress weak, overlapping bounding boxes
    idxs = cv2.dnn.NMSBoxes(boxes, confidences, confthres,
                            nmsthres)

    # TODO Prepare the output as required to the assignment specification
    # ensure at least one detection exists
    """
    object_detection_dict = {}
    object_detection_dict['id'] = uuid
    object_detection_dict['objects'] = []
    
    if len(idxs) > 0:
        for i in idxs.flatten():
            label_dictionary = {}
            label_dictionary['label'] = LABELS[classIDs[i]]
            label_dictionary['accuracy'] = confidences[i]
            label_dictionary['rectangle'] = {
                'height': boxes[i][3], 'left': boxes[i][0], 'top': boxes[i][1], 'width': boxes[i][2]}
            object_detection_dict['objects'].append(label_dictionary)
    """
    
    objects_detected = {}

    if len(idxs) > 0:
        for i in idxs.flatten():
            if confidences[i] > 0.6:
                object = LABELS[classIDs[i]]
                if object in objects_detected:
                    objects_detected[object] += 1
                else:
                    objects_detected[object] = 1

    print("doing prediction.... done returning results")
    return objects_detected


def process_data(image_data, uuid):
    print('processing data...')
    try:
	# decode base64-encoded image data
        img_bytes = base64.b64decode(str(image_data))

        # convert bytes to numpy array of uint8 data type
        decoded_image_str = np.frombuffer(img_bytes, dtype=np.uint8)

        # convert numpy array to OpenCV image format
        np_array = np.asarray(decoded_image_str)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        # make a copy of the image in RGB format
        npimg = np.array(image)
        img = npimg.copy()
        image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        labelsPath = "/var/task/coco.names"
        configPath = "/var/task/yolov3-tiny.cfg"
        weightsPath = "/var/task/yolov3-tiny.weights"

        Lables=get_labels(labelsPath)
        weigths, cfg = get_weights_config(weightsPath, configPath)
        # load the neural network model with configuration and weights
        nets = load_model(cfg, weigths)

        # perform object detection prediction on the loaded neural network model
        results = do_prediction(image, nets, Lables, uuid)
        return results

    except Exception as e:

        print("Exception  {}".format(e))




def lambda_handler(event, context):

     # Load the YOLO model
    s3_client = boto3.client('s3')
    bucket = 'imagestorage5225'

    db_connection = psycopg2.connect(
        host='database.c5rjsw404brt.us-east-1.rds.amazonaws.com',
        database='imageTags',
        user='postgres',
        password='database123',
    )

    request_body = event['body']
    req_body_json = json.loads(request_body)

    parsed_url = urlparse(req_body_json['url'])
    image_name = parsed_url.path.lstrip('/')

    tag_type = req_body_json['type']
    tags = req_body_json['tags']

    print('tag type', tag_type)
    print('image_name', image_name)
    print('tags', tags)

    cursor = db_connection.cursor()

    # Iterate over each tag in the "tags" list
    for tag in tags:
        # Extract the tag name, count, and type
        tag_name = tag['tag']
        count = tag['count']

        # Check if a row with matching image_name and tag_name already exists
        query = "SELECT count FROM objects WHERE image_name = %s AND object_name = %s"
        cursor.execute(query, (image_name, tag_name))
        row = cursor.fetchone()

        if row is not None:
            current_count = row[0]

            if tag_type == 1:  # Subtract the count
                updated_count = current_count - count

                if updated_count <= 0:
                    # Delete the row if the updated count is less than or equal to 0
                    delete_query = "DELETE FROM objects WHERE image_name = %s AND object_name = %s"
                    cursor.execute(delete_query, (image_name, tag_name))
                else:
                    # Update the count for the existing row
                    update_query = "UPDATE objects SET count = %s WHERE image_name = %s AND object_name = %s"
                    cursor.execute(update_query, (updated_count, image_name, tag_name))
            elif tag_type == 0:  # Add the count
                updated_count = current_count + count

                update_query = "UPDATE objects SET count = %s WHERE image_name = %s AND object_name = %s"
                cursor.execute(update_query, (updated_count, image_name, tag_name))
        else:
            if tag_type == 0:  # Add a new row for the tag
                insert_query = "INSERT INTO objects (image_name, object_name, count) VALUES (%s, %s, %s)"
                cursor.execute(insert_query, (image_name, tag_name, count))

    # Commit the changes to the database
    db_connection.commit()

    # Close the cursor and the database connection
    cursor.close()
    db_connection.close()

    return{
        'statusCode': 200,
        'body': json.dumps({
            'message': "Tags updated from db",
        })
    }

