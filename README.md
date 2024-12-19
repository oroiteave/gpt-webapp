# Interfaz Web para Chat con Modelos GPT

To test the app from a tokenized account you can use these credentials:

User: test@mail.com
Password: 12345678.


This project provides a web interface to interact with GPT-based chat models. It allows you to maintain multiple simultaneous conversations within a single browser tab, as well as manage, rename, and configure multiple chats at once. Additionally, it includes a login system and the ability to store your OpenAI token to use the chats.

## Main Features

- **Multiple chats in a single tab**:  
  Create, delete, and open different chats from a side list. Each chat keeps its own message history and order.
  
- **Movable chat windows**:  
  Move chat windows around within the same tab for personalized organization.
  
- **Dynamic GPT model switching**:  
  Once the chats are open, you can switch the GPT model used by each one.
  
- **Authentication and Security**:  
  - Login system for accessing the chat panel.
  - Stores the OpenAI token to make requests to the models.
  - Passwords encrypted with **BCrypt** thanks to **Spring Boot Security**.
  
- **Chat Management**:  
  - Create, delete, and rename chats from a side list.
  - Each chat preserves the order of sent and received messages.
  
## Project Architecture

The project is divided into three main modules, following a modular architecture focused on separating responsibilities:

1. **Persistence**:
   - Interacts with the **PostgreSQL** database.
   - Uses **Hibernate** and **Spring Boot JPA** for data mapping and access.
   - Integrated with **HikariCP** for connection pooling.
   - Database tests performed with **JUnit** and **Spring Boot Test**.

2. **Core**:
   - Contains business logic and "Facade" classes to abstract complexity between the **Persistence** and **Web** layers.
   - Internal logic tested with **Mockito Core**.
   - Uses **Spring Boot WebFlux** for asynchronous, non-blocking HTTP requests, allowing for multiple simultaneous requests (especially useful when several chats are open at once).

3. **Web**:
   - Presentation layer and REST controllers implemented with **Spring Boot**.
   - Uses **Spring Boot Security** for user authentication, BCrypt password encryption, and route protection.
   - Graphical interface to manage chat windows, the side chat list, and model switching.
   
## Key Technologies

- **Language**: Java 17+
- **Frameworks**:  
  - **Spring Boot** (Security, WebFlux, Data JPA, Web)
  - **Hibernate** for ORM
- **Database**: PostgreSQL
- **Security**: Spring Security + BCrypt
- **Testing**:  
  - **JUnit** and **Spring Boot Test** for integration tests.
  - **Mockito** for unit testing the Core.
- **Connection Pooling**: HikariCP
- **Maven** for dependency management.
- **Interface**:
  - **JavaScript** for chat window functionality.
  - **HTML/CSS** for the rest of the frontend.

If you have your own token you can register and add it to the account, after logging in with your
account you have a drop down button in the top right corner where you can add your own token.

![opera_iqYtDRrP7r](https://github.com/user-attachments/assets/a757852c-778c-4e31-8f99-98ffd7032217)


To create the first chat window click on the "Agregar chat" button and then click on the new chat in the list.

![opera_78k0ycDbTy](https://github.com/user-attachments/assets/fd944340-bde0-4cc2-8f36-6f00f144b37c)


In the list each chat has the option to modify the name or to be removed from the list forever.

![opera_pc2lNruhqv](https://github.com/user-attachments/assets/2e1961f4-b9bf-463b-ac66-27e201185ea2)


Each chat window is dynamic and can be manipulated as you like, it can be moved around the tabs and works
even with a variety of chats open. Each chat window has its own model and can be selected.

![opera_JTSmvvuZeU](https://github.com/user-attachments/assets/36f85521-347f-4564-9477-83891ae5b1d1)
