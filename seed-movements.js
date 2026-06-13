// using node --env-file=.env.local
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function run() {
  const { data: products } = await supabase.from('products').select('id, stock')
  if (!products) return console.error('No products found')

  const now = new Date()
  const movements = []

  // Generate OUT movements for all products over the last 7 days
  for (const product of products) {
    for (let i = 0; i < 7; i++) {
      // Randomly decide if there's a movement this day
      if (Math.random() > 0.1) {
        const qty = Math.floor(Math.random() * 25) + 5 // 5 to 30 items
        const date = new Date(now)
        date.setDate(now.getDate() - i)
        
        movements.push({
          product_id: product.id,
          type: 'OUT',
          quantity: qty,
          created_at: date.toISOString()
        })
      }
    }
  }

  const { error } = await supabase.from('movements').insert(movements)
  if (error) {
    console.error('Error inserting movements:', error)
  } else {
    console.log(`Successfully seeded ${movements.length} movements for AI prediction!`)
  }
}

run()
