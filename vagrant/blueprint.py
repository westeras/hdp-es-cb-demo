#!/usr/bin/python

import json, sys, pycurl, socket
from os.path import expanduser
from urllib import urlencode
try:
    from io import BytesIO
except ImportError:
    from StringIO import StringIO as BytesIO


hostname = socket.gethostname()
home = expanduser("~")

buffer = BytesIO()
c = pycurl.Curl()
c.setopt(c.URL, 'http://{0}:8080/api/v1/bootstrap'.format(hostname))
c.setopt(c.HTTPHEADER, ['X-Requested-By: ambari', 'Content-Type: application/json'])
c.setopt(c.USERPWD, 'admin:admin')
c.setopt(c.WRITEDATA, buffer)

with open("{0}/.ssh/id_rsa".format(home), "r") as private_key:
    content = private_key.read()

post_data = {"verbose":True, "sshKey":content, "hosts":[hostname], "user":"vagrant"}
post_fields = urlencode(post_data)

c.setopt(c.POSTFIELDS, post_fields)
c.perform()

response = int(c.getinfo(c.RESPONSE_CODE))
if (response != 200):
    print 'Request failed'




