FROM node:24-slim
WORKDIR /app
COPY apps/web/.next ./apps/web/.next
COPY apps/web/public ./apps/web/public
COPY apps/web/next.config.ts ./apps/web/next.config.ts
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/package.json ./packages/shared/package.json
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs && chown -R nextjs:nodejs /app
USER nextjs
WORKDIR /app/apps/web
EXPOSE 3000
ENV PORT=3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]
