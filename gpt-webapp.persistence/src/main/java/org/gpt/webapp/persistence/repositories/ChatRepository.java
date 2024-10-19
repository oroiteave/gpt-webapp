package org.gpt.webapp.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.gpt.webapp.persistence.entities.Chat;
import org.gpt.webapp.persistence.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Chat,Long>{
	Optional<List<Chat>> findByUserId(Long userId);
	long countByUser(User user);
}
