#!/bin/bash

# Ambari credentials
username=admin
password=admin

# Ambari host with port
ambari_server=hdp.demo:8080

# Cluster Info
cluster_name=single-node-cluster	# as shown in Ambari
host=hdp.demo				# FQDN to the new host

services=$(curl -is -u$username:$password -H "X-Requested-By: ambari" -X GET "http://$ambari_server/api/v1/clusters/$cluster_name/hosts/$host/host_components" | grep component_name | sed 's/.*:.*\"\(.*\)\".*/\1/')

for service in $services 
do
	curl -is -u$username:$password -H "X-Requested-By: ambari" -X DELETE "http://$ambari_server/api/v1/clusters/$cluster_name/hosts/$host/host_components/$service"
	curl -is -u$username:$password -H "X-Requested-By: ambari" -X POST "http://$ambari_server/api/v1/clusters/$cluster_name/hosts/$host/host_components/$service"
	curl -is -u$username:$password -H "X-Requested-By: ambari" -d "{\"RequestInfo\":{\"context\":\"Install Service: $service\"},\"Body\":{\"HostRoles\":{\"state\":\"INSTALLED\"}}}" -X PUT "http://$ambari_server/api/v1/clusters/$cluster_name/hosts/$host/host_components/$service"
done
