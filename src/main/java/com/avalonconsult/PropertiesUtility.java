package com.avalonconsult;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

/**
 * Created by adam on 2/24/15.
 */
public class PropertiesUtility {

    private Properties properties;

    public PropertiesUtility(String fileName) {
        File file = new File("src/main/resources/" + fileName);

        FileInputStream fileInput = null;
        Properties props = new Properties();

        try {
            fileInput = new FileInputStream(file);
            props.load(fileInput);
            fileInput.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        this.properties = props;
    }

    public Properties getProperties() {
        return this.properties;
    }
}
