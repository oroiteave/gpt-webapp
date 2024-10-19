package org.gpt.webapp.persistence;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
@ActiveProfiles("test")
@SpringBootTest(classes = PersistenceApp.class)
public class PersistenceAppTest {
    
  @Test
  public void shouldAnswerWithTrue() {
    assertTrue(true);
  }
  
  
}
