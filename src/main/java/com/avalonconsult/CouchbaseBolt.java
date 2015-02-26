package com.avalonconsult;

import backtype.storm.task.OutputCollector;
import backtype.storm.task.TopologyContext;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseRichBolt;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;
import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.Cluster;
import com.couchbase.client.java.CouchbaseCluster;
import com.couchbase.client.java.document.JsonDocument;
import com.couchbase.client.java.document.json.JsonObject;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.util.Map;

/**
 * Created by adam on 2/25/15.
 */
public class CouchbaseBolt extends BaseRichBolt {

    private OutputCollector collector;
    private Cluster cluster;
    private Bucket bucket;
    private JSONParser parser;

    @Override
    public void prepare(Map map, TopologyContext topologyContext, OutputCollector outputCollector) {
        this.collector = outputCollector;
        this.cluster = CouchbaseCluster.create();
        this.bucket = this.cluster.openBucket();
        this.parser = new JSONParser();
    }

    @Override
    public void execute(Tuple tuple) {
        String jsonString = tuple.getString(0);
        JSONObject googleObject = null;
        try {
            googleObject = (JSONObject) parser.parse(jsonString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        String id = (String) googleObject.get("id");

        JsonObject object = JsonObject.fromJson(jsonString);
        JsonDocument doc = JsonDocument.create(id, object);
        this.bucket.upsert(doc);
    }

    @Override
    public void declareOutputFields(OutputFieldsDeclarer outputFieldsDeclarer) {
        outputFieldsDeclarer.declare(new Fields());
    }
}
