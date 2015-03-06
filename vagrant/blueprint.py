#!/usr/bin/env python

import json, sys, requests, socket, ast, time
from os.path import expanduser

hostname = socket.gethostname()
home = expanduser("~")

headers = {'X-Requested-By':'ambari', 'Content-Type':'application/json'}

url = 'http://{0}:8080/api/v1/hosts'.format(hostname)
r = requests.get(url, auth=('admin', 'admin'))

if hostname not in [host['Hosts']['host_name'] for host in  r.json()['items']]:
    url = 'http://{0}:8080/api/v1/bootstrap'.format(hostname)

    with open("{0}/.ssh/id_rsa".format(home), "r") as private_key:
        content = private_key.read()

    post_data = {"verbose":True, "sshKey":content, "hosts":[hostname], "user":"vagrant"}

    r = requests.post(url, data=json.dumps(post_data), headers=headers, auth=('admin', 'admin'))

    if r.status_code != requests.codes.ok:
        sys.exit("Request failed - " + str(r.status_code) + " - " + r.text)
    else:
        print 'Bootstrapping command successfully sent'

    requestId = r.json()["requestId"]

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
        if hostname in [host['Hosts']['host_name'] for host in  r.json()['items']]:
            print "Hosts present"
            break
        else:
            time.sleep(3)

blueprint_name = 'single-node-cluster'

url = 'http://{0}:8080/api/v1/blueprints/'.format(hostname)
r = requests.get(url, headers=headers, auth=('admin', 'admin'))

if blueprint_name not in [blueprint['Blueprints']['blueprint_name'] for blueprint in r.json()['items']]:
    print "Submitting blueprint to Ambari"
    url = 'http://{0}:8080/api/v1/blueprints/{1}'.format(hostname, blueprint_name)
    with open("/vagrant/{0}.json".format(blueprint_name), "r") as blueprint:
        content = blueprint.read()

    r = requests.post(url, data=json.dumps(content), headers=headers, auth=('admin', 'admin'))
    if r.status_code != requests.codes.created:
        sys.exit("Submitting blueprint request failed - " + str(r.status_code) + " - " + r.text)
    else:
        print 'Submitting blueprint command successfully sent'

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
