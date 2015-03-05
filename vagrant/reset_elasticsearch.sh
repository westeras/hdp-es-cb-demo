#!/usr/bin/env bash

curl -XDELETE 'http://elasticsearch.demo:9200/demo/'

curl -XPUT 'http://elasticsearch.demo:9200/demo'
