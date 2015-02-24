package com.avalonconsult;

import twitter4j.*;

import java.io.IOException;
import java.util.Properties;

/**
 * Created by adam on 12/10/14.
 */
public class TwitterProducer {

    private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(TwitterProducer.class);

    public static void main(final String[] args) throws TwitterException, IOException {
		if (args.length != 1) {
			System.out.println("Usage: com.avalonconsult.TwitterProducer '<queryTerms>'");
			System.exit(-1);
		}

        PropertiesUtility propUtil = new PropertiesUtility("topology.properties");
        Properties properties = propUtil.getProperties();

        StatusListener listener = new TwitterStatusListener(properties.getProperty("topic"), properties.getProperty("brokerHosts"));

        TwitterStream twitterStream = new TwitterStreamFactory().getInstance();
        twitterStream.addListener(listener);

        String queryTerms[] = args;
        FilterQuery query = new FilterQuery().track(queryTerms);

        twitterStream.filter(query);
    }
}
