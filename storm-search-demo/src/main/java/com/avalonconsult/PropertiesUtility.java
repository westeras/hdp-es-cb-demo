package com.avalonconsult;

import java.io.*;
import java.util.Properties;

/**
 * Created by adam on 2/24/15.
 */
public class PropertiesUtility {

    private Properties properties;

    public PropertiesUtility(String fileName) {

        InputStream is = getClass().getResourceAsStream(fileName);
        this.properties = new Properties();

        try {
            this.properties.load(is);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Properties getProperties() {
        return this.properties;
    }
}
