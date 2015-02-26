#!/usr/bin/env python

import json, sys, time, requests

url = sys.argv[1]
print url

headers = {'X-Requested-By':'ambari', 'Content-Type':'application/json'}

r = requests.get(url, headers=headers, auth=('admin', 'admin'))
response = json.loads(r.text)
tasks = response["tasks"]

for task in tasks:
    url = task["href"]
    r = requests.get(url, headers=headers, auth=('admin', 'admin'))
    response = json.loads(r.text)

    command = response["Tasks"]["command"]
    command_detail = response["Tasks"]["command_detail"]

    print 'Waiting on {0} of {1}'.format(command, command_detail)

    while True:
        r = requests.get(url, headers=headers, auth=('admin', 'admin'))
        response = json.loads(r.text)

        if response["Tasks"]["status"] == "COMPLETED":
            print "Task complete"
            break
        else:
            time.sleep(3)
