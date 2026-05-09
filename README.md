# 📘 WOLTerWhite 📘

This is the First README for the **WOLTerWhite** project

---

## 👥 Authors

- 👨‍💻 [Tal Tkhonov](https://github.com/TalTikho)
- 👨‍💻 [Yotam Harari Lifshits](https://github.com/yhtl350)
- 👨‍💻 [Liam Homay](https://github.com/LiamHomay)

---

## 🔗 Links

- 🗺️ [UML Diagram](https://tinyurl.com/nhhnn444)

![Architecture Diagram](https://mermaid.ink/svg/pako:eNq9Vd1u2jAUfhXLUhF0BCWF8hNVlSq6aVx0Qp12M3FjxYfEW2JHtjOVMh5kF7ve9kS8zhwnsBDSlt4sFyY5Od-Pfc4haxwICtjHQUyUumUklCRZcGQuG0EJYRyti0h-XV295Vqu0Fwwrq-vixebBa9ibtK0CnFmd8Czc5SYtRq9JZp81EKSEM6RKm4q7xOSokAkCeFU_Qu_kRlvdxplrcyhV-MR5JIEsHNqKULQH-BBTwvyttKS8bCFgoR2ESuezAokaSEiQ9U5b5SbCq5EDHXRV7M376WEn7IdeIAg09A-3fp7iNMGgWeZmitN6VwKmgW6ge6lCr9e7h7yhgBO_4talfCUOijyDXataQOxIPSJXn3HYniC3in8oaVJmRMdvVrh7Axtf23_bH9vf2x_ovY9xEQz06wRS3c7tVPtONd2VH00NUehQaEWmvEvEGiFbiE1xww8YKBqkLr1PbyWV52PWk6x5trCccq59dFNGEoIrVfU9jq1pF3Ja3mRiGn-L8VXnSp3wXn1vder-bgHErPHEjzjEUimCQ-gRO9lLLQ6JwfQpuTjWXgRctTPDYjyGI7I8yOeHdbhkzI11ALlbYKoeVVgj1SegZoqUQtFSyFRLEIWlMar-db8cR9UvOMuDiWj2F-SWEEXJyBNY5hnbDt9gXUECSywb24pkV8XeME3BpQS_lmIBPtaZgYmRRZGe5IsNc6g_EjtU_I-lVORcY19bzixHNhf4wfsj0e9i8vBeOJeDibu0B2Mu3iF_f5Fz_P6Q-9y0He9sXux6eJHq-n2Jp4JeOPRYNgfDd2-yQfKzP7uyo9k_rP5C1qWRME)

---

## Tech Stack

- ©️ Cmake
- 🐳 Docker

---

## Features/Commands

- Add Product
- Recommand
- Help
- Dockerized deployment 🐳

---

## 🛠️ How to run

### 🐳 Docker Setup

1. Make sure that you have **Docker Desktop** on your machine, and clone the repository. Then:

    ```bash
    git clone https://github.com/TalTikho/wolterwhite
    cd wolterwhite
    ```

    > ⚠️ **NOTE**: Please make sure your **DockerDesktop** is open.

2. Start the environment:

    Run the following command to build and start the container in the background.

    ```bash
    docker-compose up --build -d
    ```

3. ▶️ Run the Application:

     You can run the main directly through the container:

    ```bash
    docker exec -it wolterwhite_container ./wolterwhite
    ```

    > ⚠️ **NOTE**: To stop the run, Enter: **quit**

4. ▶️ Run Tests:

     To verify the system using the built-in test suite:

    ```bash
    docker exec -it wolterwhite_container ./tests/runTests
    ```

5. ⏯️ Stopping the project:

     When you are finished, shut down the containers and clean up resources:

    ``` bash
    docker-compose down
    ```

---

## 🧪 Development & Testing

### 🛠️ Manual Build (Inside Container)

If you need to enter the container to run commands manually or debug:

``` bash
docker exec -it wolterwhite_container bash
```

### 🧹 Maintenance

If you need to clear old images and free up disk space:

``` bash
docker system prune -a
```

---

## 📝 Implementation Notes

- Silent Validation: Input errors such as missing IDs or non-numeric "gibberish" are handled silently without crashing the application.

- Storage: Data is persisted in the `/data` directory, which is maintained across container restarts.

---

## Running the Docker commands

- **Starting the environment:**
![Running](.\media\Starting_The_Environment.png)

- **Running the Application:**
![Running](.\media\Running_The_Application.png)

- **Running An Exaple:**
![Running](.\media\Running_The_Application_Using_An_Example.png)

- **Running Recommend Example:**
![Running](.\media\Running_Recommend_Example.png)

- **Empty Output When Unique:**
![Running](.\media\Should_Not_Recommend_Is_Unique.png)

- **Not Unique Anymore:**
![Running](.\media\Adding_So_Not_Unique.png)

- **Now It Is Valid For Recommendation:**
![Running](.\media\Able_To_Recommend_After_Added.png)

- **Invalid Add Input:**
![Running](.\media\Invalid_Add_Input.png)

- **Invalid Recommend Input:**
![Running](.\media\Invalid_Recommend_Input.png)

- **Using 'quit' To Stop The Run:**
![Running](.\media\Stopping_Using_Quit.png)

- **Passed All The Tests:**
![Running](.\media\Running_All_Tests_01.png)
![Running](.\media\Running_All_Tests_02.png)

- **Stopping the project:**
![Running](.\media\Stopping_The_Docker.png)

---
