FROM node:20-slim
WORKDIR /app
COPY apps/api/dist ./apps/api/dist
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/package.json ./apps/api/package.json
COPY apps/api/entrypoint.sh ./apps/api/entrypoint.sh
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/package.json ./packages/shared/package.json
RUN chmod +x ./apps/api/entrypoint.sh
RUN mkdir -p /tmp/spikeclip-clips
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs && chown -R nestjs:nodejs /app /tmp/spikeclip-clips
USER nestjs
WORKDIR /app/apps/api
EXPOSE 3001
CMD ["./entrypoint.sh"]
