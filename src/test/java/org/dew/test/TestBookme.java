package org.dew.test;

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
    
  }
}
