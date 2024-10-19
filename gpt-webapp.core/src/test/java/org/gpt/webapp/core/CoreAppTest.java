package org.gpt.webapp.core;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest(classes = CoreApp.class)
public class CoreAppTest {
    
  @Test
  public void shouldAnswerWithTrue() {
    assertTrue(true);
  }
}
