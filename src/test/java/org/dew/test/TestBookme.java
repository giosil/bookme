package org.dew.test;

import org.dew.bookme.util.SMSManager;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public class TestBookme extends TestCase {
  
  public TestBookme(String testName) {
    super(testName);
  }
  
  public static Test suite() {
    return new TestSuite(TestBookme.class);
  }
  
  public void testApp() throws Exception {
    SMSManager.sendSMS("+393498165247", "Messaggio di prova");
  }
}
