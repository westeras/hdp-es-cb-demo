#!/usr/bin/env python

import json, sys, requests, socket, ast, time
from os.path import expanduser

hostname = socket.gethostname()
home = expanduser("~")

headers = {'X-Requested-By':'ambari', 'Content-Type':'application/json'}

blueprint_name = 'single-node-cluster'

url = 'http://{0}:8080/api/v1/blueprints/'.format(hostname)
r = requests.get(url, headers=headers, auth=('admin', 'admin'))

if blueprint_name not in [blueprint['Blueprints']['blueprint_name'] for blueprint in r.json()['items']]:
    print "Submitting blueprint to Ambari"
    url = 'http://{0}:8080/api/v1/blueprints/{1}'.format(hostname, blueprint_name)
    with open("/vagrant/files/{0}.json".format(blueprint_name), "r") as blueprint:
        content = blueprint.read()

    r = requests.post(url, data=json.dumps(content), headers=headers, auth=('admin', 'admin'))
    if r.status_code != requests.codes.created:
        sys.exit("Submitting blueprint request failed - " + str(r.status_code) + " - " + r.text)
    else:
        print 'Submitting blueprint command successfully sent'
