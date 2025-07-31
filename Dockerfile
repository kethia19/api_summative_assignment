FROM nginx:alpine

COPY ./frontend/ /usr/share/nginx/html/

# Used port
EXPOSE 80

# Starting nginx
CMD ["nginx", "-g", "daemon off;"]
