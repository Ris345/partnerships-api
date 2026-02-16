FROM postgis/postgis:18-3.6

# Install pgTAP (https://pgtap.org/)
RUN apt update && apt install -y pgtap

# Install PostgreSQL Anonymizer (see https://postgresql-anonymizer.readthedocs.io/en/stable/INSTALL/#install-on-debian-ubuntu)
RUN apt install -y curl && \ 
  echo "deb http://apt.dalibo.org/labs bookworm-dalibo main" > /etc/apt/sources.list.d/dalibo-labs.list && \
  curl -fsSL -o /etc/apt/trusted.gpg.d/dalibo-labs.gpg https://apt.dalibo.org/labs/debian-dalibo.gpg && \
  apt update && apt install -y postgresql_anonymizer_18

# Uninstall superfluous dependencies
RUN apt purge --autoremove -y curl

# Copy postgres config file in order to add 'anon' to shared_preload_libraries
COPY --chown=postgres:postgres ./postgresql.conf /etc/postgresql.conf 

# Set the command to start PostgreSQL using the custom config file
CMD ["postgres", "-c", "config_file=/etc/postgresql.conf"]