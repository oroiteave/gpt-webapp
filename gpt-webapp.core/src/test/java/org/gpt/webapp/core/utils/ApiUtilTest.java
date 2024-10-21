package org.gpt.webapp.core.utils;

import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.gpt.webapp.core.services.impl.DefaultChatBotService;
import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.Message;
import org.gpt.webapp.persistence.repositories.ChatRepository;
import org.gpt.webapp.persistence.repositories.MessageRepository;
import org.gpt.webapp.persistence.repositories.UserRepository;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class ApiUtilTest {
	
	@MockBean
    private ChatRepository chatRepository;
	
	@MockBean
	private MessageRepository messageRepository;
	
	@MockBean
	private UserRepository userRepository;
	
	@Autowired
	private DefaultChatBotService chatBotService;
	
	private Message messageTest;
	private Chat chatTest;
	
	private List<Message> messagesTest;
	@BeforeEach
	void setUp() {
		chatTest = new Chat();
		chatTest.setModel("gpt-3.5-turbo");
		
		messageTest = new Message();
		messageTest.setContent("hola me llamo oroi");
		messageTest.setRole("user");
		
		
		messagesTest = new ArrayList<>();
		messagesTest.add(messageTest);
	}
	
    @Test
    public void testSendChatRequest() throws JSONException {
    	String response = chatBotService.sendPrompt(messagesTest,chatTest.getModel(), "token");
    	
    	assertNotNull(response);
    }
    
    @Test
    public void testShouldChatWithContext()throws JSONException{
    	String response = chatBotService.sendPrompt(messagesTest,chatTest.getModel(),"token");
    	
    	assertNotNull(response);
    	
    	JSONObject obj = new JSONObject(response);
	 	JSONObject message1 = obj.getJSONArray("choices").getJSONObject(0).getJSONObject("message");
	 	String gptmessage = message1.getString("content");
	 	
	 	System.out.println(gptmessage);
	 	
	 	Message gptReturn = new Message();
	 	gptReturn.setContent(gptmessage);
	 	gptReturn.setRole(message1.getString("role"));
	 	
	 	Message userResponse = new Message();
	 	userResponse.setContent("di mi nombre");
	 	userResponse.setRole("user");
	 	
	 	messagesTest.add(gptReturn);
	 	messagesTest.add(userResponse);
	 	
	 	String response1 = chatBotService.sendPrompt(messagesTest,chatTest.getModel(),"token");
	 	obj = new JSONObject(response1);
	 	message1 = obj.getJSONArray("choices").getJSONObject(0).getJSONObject("message");
	 	String gptmessage1 = message1.getString("content");
	 	System.out.println(gptmessage1);
    }
}
