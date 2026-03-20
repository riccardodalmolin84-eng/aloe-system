const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gmhyucystwoxiinyptwx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2gExbZoCjh1NBCAJO0ZPWA_Ek2M86xG';

const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
    console.log('--- STARTING SUPABASE KEEP-ALIVE ---');
    try {
        console.log('1. Fetching workspaces to simulate API activity...');
        const { data: workspaces, error: workspaceErr } = await supabase.from('workspaces').select('id, name').limit(5);
        if (workspaceErr) {
             console.warn('Workspace query returned error (maybe RLS). Ignoring as request is still registered.', workspaceErr);
        } else {
             console.log(`   ✓ Found ${workspaces ? workspaces.length : 0} workspaces.`);
        }

        console.log('2. Fetching recent recipes to simulate read activity...');
        const { data: recipes, error: recipesErr } = await supabase.from('recipes').select('id').limit(1);
        if (recipesErr) {
             console.warn('Recipes query returned error (maybe RLS). Ignoring as request is still registered.', recipesErr);
        } else {
             console.log(`   ✓ Read operation successful.`);
        }

        console.log('3. Triggering Auth API...');
        // We can just try a dummy login. It will fail, but the API request is registered as compute activity reliably.
        await supabase.auth.signInWithPassword({
            email: 'keepalive@aloe.system',
            password: 'dummy-password'
        });
        console.log('   ✓ Auth ping complete.');

        console.log('--- SUPABASE KEEP-ALIVE COMPLETED SUCCESSFULLY ---');
        console.log('Sufficient activity has been generated to prevent the project from pausing.');
        process.exit(0);
    } catch (err) {
        console.error('--- SUPABASE KEEP-ALIVE FAILED ---');
        console.error(err);
        process.exit(1);
    }
}

keepAlive();
