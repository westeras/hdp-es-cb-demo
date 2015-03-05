#!/usr/bin/env bash

/opt/couchbase/bin/couchbase-cli bucket-delete -c 127.0.0.1:8091 --bucket=demo -u couchbase -p couchbase

sleep 3

/opt/couchbase/bin/couchbase-cli xdcr-setup -c 127.0.0.1:8091 --delete --xdcr-cluster-name=elasticsearch -u couchbase -p couchbase

sleep 3

/opt/couchbase/bin/couchbase-cli bucket-create -c 127.0.0.1:8091 --bucket=demo --bucket-type=couchbase --bucket-port=11211 --bucket-ramsize=796  --bucket-replica=0 -u couchbase -p couchbase

sleep 3
  
/opt/couchbase/bin/couchbase-cli xdcr-setup -c 127.0.0.1:8091 --create --xdcr-cluster-name=elasticsearch --xdcr-hostname=elasticsearch.demo:9091 --xdcr-username=couchbase --xdcr-password=couchbase -u couchbase -p couchbase

sleep 3
  
/opt/couchbase/bin/couchbase-cli xdcr-replicate -c 127.0.0.1:8091 --create --xdcr-cluster-name=elasticsearch --xdcr-from-bucket=demo --xdcr-to-bucket=demo --xdcr-replication-mode=capi -u couchbase -p couchbase
