package com.avalonconsult;

import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import kafka.producer.ProducerConfig;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;

import java.util.Properties;

/**
 * Created by adam on 2/24/15.
 */
public class TwitterStatusListener implements StatusListener {

    private String topic;
    private Producer<String, String> producer;
    private String brokerList;

    private static final Logger LOG = LoggerFactory.getLogger(TwitterStatusListener.class);

    public TwitterStatusListener(String topic, String brokerList) {
        this.topic = topic;
        this.brokerList = brokerList;

        Properties props = new Properties();
        props.put("metadata.broker.list", this.brokerList);
        props.put("serializer.class", "kafka.serializer.StringEncoder");
        ProducerConfig config = new ProducerConfig(props);

        this.producer = new Producer<String, String>(config);
    }

    @Override
    public void onStatus(Status status) {
        JSONObject tweet = new JSONObject();
        tweet.put("id", status.getId());
        tweet.put("user", status.getUser().getScreenName());
        tweet.put("name", status.getUser().getName());
        tweet.put("location", status.getUser().getLocation());
        tweet.put("text", status.getText());
        if (null != status.getGeoLocation()) {
            tweet.put("latitude", status.getGeoLocation().getLatitude());
            tweet.put("longitude", status.getGeoLocation().getLongitude());
        }
        String tweetString = tweet.toJSONString();

        KeyedMessage<String, String> data = new KeyedMessage<String, String>(this.topic, tweetString);
        this.producer.send(data);
    }

    @Override
    public void onDeletionNotice(StatusDeletionNotice statusDeletionNotice) {}
    @Override
    public void onTrackLimitationNotice(int i) {}
    @Override
    public void onScrubGeo(long l, long l1) {}
    @Override
    public void onStallWarning(StallWarning stallWarning) {}
    @Override
    public void onException(Exception e) {}
}
