#!/usr/bin/env python

import json, sys, requests, socket, ast, time
from os.path import expanduser

hostname = socket.gethostname()
home = expanduser("~")

time.sleep(5)
url = 'http://{0}:8080/api/v1/bootstrap'.format(hostname)
headers = {'X-Requested-By':'ambari', 'Content-Type':'application/json'}

with open("{0}/.ssh/id_rsa".format(home), "r") as private_key:
    content = private_key.read()

post_data = {"verbose":True, "sshKey":content, "hosts":[hostname], "user":"vagrant"}

r = requests.post(url, data=json.dumps(post_data), headers=headers, auth=('admin', 'admin'))

if r.status_code != requests.codes.ok:
    print 'Request failed'
else:
    print 'Bootstrapping command successfully sent'

response = ast.literal_eval(r.text)
requestId = response["requestId"]

print "Waiting on Ambari to install and register host"
url = "{0}/{1}".format(url, requestId)
while True:
    r = requests.get(url, auth=('admin', 'admin'))
    if "SUCCESS" in r.text:
        print "Bootstrapping complete"
        break
    else:
        time.sleep(3)

print "Waiting on host to appear"
url = 'http://{0}:8080/api/v1/hosts'.format(hostname)
while True:
    r = requests.get(url, auth=('admin', 'admin'))
    if "hdp.demo" in r.text:
        print "Hosts present"
        break
    else:
        time.sleep(3)

print "Pausing 10 seconds before submitting blueprint to Ambari"
time.sleep(10)
print "Submitting blueprint to Ambari"
url = 'http://{0}:8080/api/v1/blueprints/single-node-cluster'.format(hostname)
with open("/vagrant/single-node-cluster.json", "r") as blueprint:
    content = blueprint.read()

r = requests.post(url, data=json.dumps(content), headers=headers, auth=('admin', 'admin'))

print "Pausing 10 seconds before submitting cluster topology"
time.sleep(10)
print 'Submitting cluster topology to Ambari'
url = 'http://{0}:8080/api/v1/clusters/single-node-cluster'.format(hostname)
with open("/vagrant/single-node-mapping.json", "r") as cluster:
    content = cluster.read()

r = requests.post(url, data=json.dumps(content), headers=headers, auth=('admin', 'admin'))
