# Install Browser, OS dependencies and Python modules
# NOTE - On x86 windows add --provenance=false to docker build or error is thrown
FROM public.ecr.aws/lambda/python:3.8 AS lambda-base
# FROM python:3.7-slim-buster as base

COPY requirements.txt /tmp/

# Install Python dependencies for function
RUN pip install --upgrade pip -q
RUN pip install -r /tmp/requirements.txt -q

COPY src ${LAMBDA_TASK_ROOT}

CMD [ "main.handler" ]