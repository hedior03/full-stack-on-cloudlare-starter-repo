import { WorkerEntrypoint } from 'cloudflare:workers';
import { initDatabase } from '@repo/data-ops/database';
import { app } from '@/api/app';

export default class DataService extends WorkerEntrypoint<Env> {
	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		initDatabase(env.DB);
	}

	fetch(request: Request) {
		const ctx = this.ctx;
		const env = this.env;
		return app.fetch(request, env, ctx);
	}
}
