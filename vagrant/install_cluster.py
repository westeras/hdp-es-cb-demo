#!/usr/bin/env python

import json, sys, requests, socket, ast, time
from os.path import expanduser

hostname = socket.gethostname()
home = expanduser("~")

headers = {'X-Requested-By':'ambari', 'Content-Type':'application/json'}

mapping_name = 'single-node-mapping'

url = 'http://{0}:8080/api/v1/clusters/'.format(hostname)
r = requests.get(url, headers=headers, auth=('admin', 'admin'))

if mapping_name not in [cluster['Clusters']['cluster_name'] for cluster in r.json()['items']]:
    print 'Submitting cluster topology to Ambari'
    url = 'http://{0}:8080/api/v1/clusters/{1}'.format(hostname, mapping_name)
    with open("/vagrant/{0}.json".format(mapping_name), "r") as cluster:
        content = cluster.read()

    r = requests.post(url, data=json.dumps(content), headers=headers, auth=('admin', 'admin'))

    if r.status_code != requests.codes.accepted:
        sys.exit("Submitting cluster request failed - " + str(r.status_code) + " - " + r.text)
    else:
        print 'Submitting cluster command successfully sent'
        url = r.json()['href']
        while True:
            r = requests.get(url, auth=('admin', 'admin'))
            if r.status_code != requests.codes.ok:
                sys.exit("Error checking cluster install status - " + str(r.status_code) + " - " + r.text)
            status = r.json()['Requests']['request_status']
            if r.json()['Requests']['request_status'] == "COMPLETED":
                print "Cluster installation complete"
                break
            else:
                time.sleep(5)
