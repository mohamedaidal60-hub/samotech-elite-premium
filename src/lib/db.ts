import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_DB1xcyzek5Na@ep-misty-pine-an7v9or4-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

export default sql;
