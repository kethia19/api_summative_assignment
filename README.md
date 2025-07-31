# FarmCast - Weather Alert App for Farmers

FarmCast is a simple web application that helps farmers know the current weather and get alerts for extreme conditions like heatwaves or tornadoes — based on their current location.

It uses the [WeatherAPI Current Weather API](https://www.weatherapi.com/docs/) and runs in a Docker container. You can deploy it locally or on distributed web servers with a load balancer.

---

## Features
- Auto-detects user location
- Displays temperature, humidity, wind speed, UV index
- Shows alerts for extreme weather (like high UV or tornado)
- Lightweight and mobile-friendly interface

---

## 📦 Docker Image
**Docker Hub:** `https://hub.docker.com/r/kethia19/api_summative_assignment`

**Image name:** `kethia19/api_summative_assignment`

**Tags:** `v1`, `latest`

---

## Run Locally (with Docker)

### 1. Get your WeatherAPI key
1. Go to https://www.weatherapi.com/signup.aspx and create a free account.
2. After signing up, visit https://www.weatherapi.com/my/ to view your API key.
3. Copy the key and use it in the next steps.

### 2. Clone the repo
```bash
git clone https://github.com/kethia19/api_summative_assignment.git
cd api_summative_assignment
```bash
git clone https://github.com/kethia19/api_summative_assignment.git
cd api_summative_assignment
```

### 3. Build the image
```bash
docker build -t kethia19/api_summative_assignment:v1 .
```

### 4. Run the container (secure method)
```bash
docker run -d --name farmcast \
  -p 8080:8080 \
  -e WEATHER_API_KEY=your_api_key_here \
  kethia19/api_summative_assignment:v1
```

Then open your browser at:
```
http://localhost:8080
```

---

## Lab Environment Setup

This app runs in a 3-container Docker lab environment based on the [`web_infra_lab`](https://github.com/waka-man/web_infra_lab) project.

To set up the environment I used:
```bash
git clone https://github.com/waka-man/web_infra_lab.git
cd web_infra_lab
docker compose up -d
```

Once running:
- `web-01` and `web-02` will host your app containers
- `lb-01` is the HAProxy load balancer

Access containers with:
```bash
docker exec -it web-01 bash
```

---

## Deploy on Web01 & Web02
SSH into each server and run:
```bash
docker pull kethia19/api_summative_assignment:v1

docker run -d --name farmcast \
  --restart unless-stopped \
  -p 8080:8080 \
  -e WEATHER_API_KEY=your_api_key_here \
  kethia19/api_summative_assignment:v1
```

Make sure it is reachable at:
```
http://web-01:8080
http://web-02:8080
```

---

## HAProxy Load Balancer (Lb01)

FarmCast listens on port **8080** inside each container, and your HAProxy setup will forward incoming traffic from **port 80** on Lb01 to these backend servers.

Update `/etc/haproxy/haproxy.cfg`:
```haproxy
backend webapps
  balance roundrobin
  server web01 172.20.0.11:8080 check
  server web02 172.20.0.12:8080 check
```

Then reload HAProxy:
```bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
```

### Test Load Balancing
Run this from your host multiple times:
```bash
curl http://localhost
```
You should see alternating responses coming from Web01 and Web02.

---

## Handling Secrets
The `.env` file isn't included inside the Docker image. Instead, the API key is passed securely as an environment variable during runtime using `-e` or `--env-file`.

---

## 🙏 Credits
- [WeatherAPI - Current Weather](https://www.weatherapi.com/docs/)

---

## Directory Structure
```
/public
  ├── index.html
  ├── style.css
  └── script.js
server.js
Dockerfile
README.md
```

---

## Demo Video

---

> Api_summative_assignment End
