package org.gpt.webapp.persistence.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class Message {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(name = "event_timestamp", columnDefinition = "TIMESTAMP")
	private LocalDateTime eventTimestamp;
	
	@ManyToOne
	@JoinColumn(name = "chat_id", nullable = false)
	@JsonBackReference
	private Chat chat;
	
	@Column(length = 24000)
	private String content;
	
	private String role;
	private int totalTokens;
	
	@PrePersist
    protected void onCreate() {
        this.eventTimestamp = LocalDateTime.now();
    }
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public LocalDateTime getEventTimestamp() {
		return eventTimestamp;
	}
	public void setEventTimestamp(LocalDateTime eventTimestamp) {
		this.eventTimestamp = eventTimestamp;
	}
	public Chat getChat() {
		return chat;
	}
	public void setChat(Chat chat) {
		this.chat = chat;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public int getTotalTokens() {
		return totalTokens;
	}
	public void setTotalTokens(int totalTokens) {
		this.totalTokens = totalTokens;
	}
}