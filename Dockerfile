FROM node:22-alpine3.20 AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy the Prisma schema
COPY prisma ./prisma

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client
RUN npx prisma generate

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install OpenSSH server
RUN apk add --no-cache openssh

# Configure SSH with Azure's recommended settings
RUN ssh-keygen -A \
    && echo "root:Docker!" | chpasswd \
    && echo "Port 2222" >> /etc/ssh/sshd_config \
    && echo "ListenAddress 0.0.0.0" >> /etc/ssh/sshd_config \
    && echo "LoginGraceTime 180" >> /etc/ssh/sshd_config \
    && echo "X11Forwarding yes" >> /etc/ssh/sshd_config \
    && echo "Ciphers aes128-cbc,3des-cbc,aes256-cbc,aes128-ctr,aes192-ctr,aes256-ctr" >> /etc/ssh/sshd_config \
    && echo "MACs hmac-sha1,hmac-sha1-96" >> /etc/ssh/sshd_config \
    && echo "StrictModes yes" >> /etc/ssh/sshd_config \
    && echo "SyslogFacility DAEMON" >> /etc/ssh/sshd_config \
    && echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config \
    && echo "PermitEmptyPasswords no" >> /etc/ssh/sshd_config \
    && echo "PermitRootLogin yes" >> /etc/ssh/sshd_config \
    && echo "Subsystem sftp internal-sftp" >> /etc/ssh/sshd_config

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown -R nextjs:nodejs /app

# Ensure node_modules directory is writable
COPY --from=builder /app/node_modules ./node_modules
RUN chown -R nextjs:nodejs ./node_modules

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the Prisma directory
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Expose SSH and application ports
EXPOSE 2222 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Start SSH and the application
CMD ["/bin/sh", "-c", "/usr/sbin/sshd && node server.js"]