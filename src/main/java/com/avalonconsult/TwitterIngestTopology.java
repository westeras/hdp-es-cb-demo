package com.avalonconsult;

import backtype.storm.Config;
import backtype.storm.LocalCluster;
import backtype.storm.generated.StormTopology;
import backtype.storm.spout.SchemeAsMultiScheme;
import backtype.storm.topology.TopologyBuilder;
import backtype.storm.utils.Utils;
import org.apache.storm.hdfs.bolt.HdfsBolt;
import org.apache.storm.hdfs.bolt.format.DefaultFileNameFormat;
import org.apache.storm.hdfs.bolt.format.DelimitedRecordFormat;
import org.apache.storm.hdfs.bolt.format.FileNameFormat;
import org.apache.storm.hdfs.bolt.format.RecordFormat;
import org.apache.storm.hdfs.bolt.rotation.FileRotationPolicy;
import org.apache.storm.hdfs.bolt.rotation.FileSizeRotationPolicy;
import org.apache.storm.hdfs.bolt.sync.CountSyncPolicy;
import org.apache.storm.hdfs.bolt.sync.SyncPolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import storm.kafka.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;
import java.util.UUID;

/**
 * Created by adam on 2/24/15.
 */
public class TwitterIngestTopology {

    private static final Logger LOG = LoggerFactory.getLogger(TwitterIngestTopology.class);

    public static void main(String[] args) {

        Properties properties = loadPropertiesFile();

        String zkHosts = properties.getProperty("zkHosts");
        String topic = properties.getProperty("topic");
        String hdfsPath = properties.getProperty("hdfsPath");

        TopologyBuilder topologyBuilder = new TopologyBuilder();

        // Configure Kafka spout
        BrokerHosts hosts = new ZkHosts(zkHosts);
        SpoutConfig spoutConfig = new SpoutConfig(hosts, topic, "/" + topic, UUID.randomUUID().toString());
        spoutConfig.scheme = new SchemeAsMultiScheme(new StringScheme());

        // Configure HDFS Bolt
        RecordFormat format = new DelimitedRecordFormat().withFieldDelimiter("|");
        SyncPolicy syncPolicy = new CountSyncPolicy(500);
        FileRotationPolicy rotationPolicy = new FileSizeRotationPolicy(5.0f, FileSizeRotationPolicy.Units.MB);
        FileNameFormat fileNameFormat = new DefaultFileNameFormat().withPath(hdfsPath);

        HdfsBolt hdfsBolt = new HdfsBolt()
                .withFsUrl(properties.getProperty("fsUrl"))
                .withFileNameFormat(fileNameFormat)
                .withRecordFormat(format)
                .withRotationPolicy(rotationPolicy)
                .withSyncPolicy(syncPolicy);

        topologyBuilder.setSpout("kafka-spout", new KafkaSpout(spoutConfig));
        topologyBuilder.setBolt("hdfsBolt", hdfsBolt).shuffleGrouping("kafka-spout");
        topologyBuilder.setBolt("geoEnrichment", new GeoEnrichmentBolt()).shuffleGrouping("kafka-spout");

        Config conf = new Config();

        LocalCluster cluster = new LocalCluster();
        cluster.submitTopology("test", conf, topologyBuilder.createTopology());
        Utils.sleep(60000);
        cluster.killTopology("test");
        cluster.shutdown();
    }

    private static Properties loadPropertiesFile() {

        File file = new File("src/main/resources/topology.properties");

        FileInputStream fileInput = null;
        Properties properties = new Properties();

        try {
            fileInput = new FileInputStream(file);
            properties.load(fileInput);
            fileInput.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return properties;
    }

}
