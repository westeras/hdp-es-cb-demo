package com.avalonconsult;

import twitter4j.*;

import java.io.IOException;

/**
 * Created by adam on 12/10/14.
 */
public class TwitterProducer {

    private static final org.slf4j.Logger LOG = org.slf4j.LoggerFactory.getLogger(TwitterProducer.class);

    public static void main(final String[] args) throws TwitterException, IOException {
		if (args.length != 3) {
			System.out.println("Usage: com.avalonconsult.TwitterProducer '<topic>' '<brokerList>' '<queryTerms>'");
			System.exit(-1);
		}

        StatusListener listener = new TwitterStatusListener(args[0], args[1]);

        TwitterStream twitterStream = new TwitterStreamFactory().getInstance();
        twitterStream.addListener(listener);

        String queryTerms[] = args[2].split(" ");
        FilterQuery query = new FilterQuery().track(queryTerms);

        twitterStream.filter(query);
    }
}
