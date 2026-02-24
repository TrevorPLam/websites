FROM cgr.dev/chainguard/wolfi-base:latest

LABEL org.opencontainers.image.title="marketing-security-tooling"
LABEL org.opencontainers.image.description="Minimal security tooling image for CI signature workflows"

RUN apk add --no-cache bash curl jq

CMD ["bash"]
