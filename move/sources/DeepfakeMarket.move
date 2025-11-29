module deepfake_hunters::market {
    use std::signer;
    use std::string::String;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::table::{Self, Table};
    use aptos_framework::event;

    // Errors
    const E_MARKET_ALREADY_RESOLVED: u64 = 1;
    const E_MARKET_NOT_RESOLVED: u64 = 2;
    const E_NOT_AUTHORIZED: u64 = 3;
    const E_NO_WINNINGS: u64 = 4;
    const E_ALREADY_CLAIMED: u64 = 5;
    const E_INSUFFICIENT_STAKE: u64 = 6;

    struct Market has store {
        id: u64,
        creator: address,
        content_hash: String,
        real_pool: Coin<AptosCoin>,
        ai_pool: Coin<AptosCoin>,
        total_real_stake: u64,
        total_ai_stake: u64,
        resolved: bool,
        is_real: bool,
        // Map address to their stake amount
        real_bets: Table<address, u64>,
        ai_bets: Table<address, u64>,
        has_claimed: Table<address, bool>,
    }

    struct MarketStore has key {
        markets: Table<u64, Market>,
        market_count: u64,
    }

    struct AdminCap has key { }

    // Events
    #[event]
    struct MarketCreated has drop, store {
        market_id: u64,
        creator: address,
        content_hash: String,
    }

    #[event]
    struct BetPlaced has drop, store {
        market_id: u64,
        bettor: address,
        is_real: bool,
        amount: u64,
    }

    #[event]
    struct MarketResolved has drop, store {
        market_id: u64,
        is_real: bool,
    }

    fun init_module(sender: &signer) {
        move_to(sender, MarketStore {
            markets: table::new(),
            market_count: 0,
        });
        move_to(sender, AdminCap {});
    }

    public entry fun create_market(sender: &signer, content_hash: String) acquires MarketStore {
        let sender_addr = signer::address_of(sender);
        let store = borrow_global_mut<MarketStore>(@deepfake_hunters);
        
        let market_id = store.market_count + 1;
        
        let market = Market {
            id: market_id,
            creator: sender_addr,
            content_hash,
            real_pool: coin::zero<AptosCoin>(),
            ai_pool: coin::zero<AptosCoin>(),
            total_real_stake: 0,
            total_ai_stake: 0,
            resolved: false,
            is_real: false,
            real_bets: table::new(),
            ai_bets: table::new(),
            has_claimed: table::new(),
        };

        table::add(&mut store.markets, market_id, market);
        store.market_count = market_id;

        event::emit(MarketCreated {
            market_id,
            creator: sender_addr,
            content_hash,
        });
    }

    public entry fun place_bet(sender: &signer, market_id: u64, is_real: bool, amount: u64) acquires MarketStore {
        let sender_addr = signer::address_of(sender);
        let store = borrow_global_mut<MarketStore>(@deepfake_hunters);
        let market = table::borrow_mut(&mut store.markets, market_id);

        assert!(!market.resolved, E_MARKET_ALREADY_RESOLVED);
        assert!(amount > 0, E_INSUFFICIENT_STAKE);

        let coins = coin::withdraw<AptosCoin>(sender, amount);

        if (is_real) {
            coin::merge(&mut market.real_pool, coins);
            market.total_real_stake = market.total_real_stake + amount;
            let current_bet = if (table::contains(&market.real_bets, sender_addr)) {
                *table::borrow(&market.real_bets, sender_addr)
            } else { 0 };
            table::upsert(&mut market.real_bets, sender_addr, current_bet + amount);
        } else {
            coin::merge(&mut market.ai_pool, coins);
            market.total_ai_stake = market.total_ai_stake + amount;
            let current_bet = if (table::contains(&market.ai_bets, sender_addr)) {
                *table::borrow(&market.ai_bets, sender_addr)
            } else { 0 };
            table::upsert(&mut market.ai_bets, sender_addr, current_bet + amount);
        };

        event::emit(BetPlaced {
            market_id,
            bettor: sender_addr,
            is_real,
            amount,
        });
    }

    public entry fun resolve_market(sender: &signer, market_id: u64, is_real: bool) acquires MarketStore, AdminCap {
        // Only admin (Veritas Oracle) can resolve
        assert!(exists<AdminCap>(signer::address_of(sender)), E_NOT_AUTHORIZED);
        
        let store = borrow_global_mut<MarketStore>(@deepfake_hunters);
        let market = table::borrow_mut(&mut store.markets, market_id);
        
        assert!(!market.resolved, E_MARKET_ALREADY_RESOLVED);

        market.resolved = true;
        market.is_real = is_real;

        event::emit(MarketResolved {
            market_id,
            is_real,
        });
    }

    public entry fun claim_reward(sender: &signer, market_id: u64) acquires MarketStore {
        let sender_addr = signer::address_of(sender);
        let store = borrow_global_mut<MarketStore>(@deepfake_hunters);
        let market = table::borrow_mut(&mut store.markets, market_id);

        assert!(market.resolved, E_MARKET_NOT_RESOLVED);
        
        // Check if already claimed
        if (table::contains(&market.has_claimed, sender_addr)) {
            assert!(!*table::borrow(&market.has_claimed, sender_addr), E_ALREADY_CLAIMED);
        };

        let user_stake = if (market.is_real) {
            if (table::contains(&market.real_bets, sender_addr)) {
                *table::borrow(&market.real_bets, sender_addr)
            } else { 0 }
        } else {
            if (table::contains(&market.ai_bets, sender_addr)) {
                *table::borrow(&market.ai_bets, sender_addr)
            } else { 0 }
        };

        // Only winners can claim
        let user_won = (market.is_real && table::contains(&market.real_bets, sender_addr)) || 
                       (!market.is_real && table::contains(&market.ai_bets, sender_addr));
        
        assert!(user_won && user_stake > 0, E_NO_WINNINGS);

        // Calculate reward
        // Reward = UserStake + (UserStake / TotalWinningStake) * TotalLosingStake
        // Formula: (UserStake * (TotalReal + TotalAI)) / TotalWinningStake
        
        let total_pool_value = coin::value(&market.real_pool) + coin::value(&market.ai_pool);
        let total_winning_stake = if (market.is_real) { market.total_real_stake } else { market.total_ai_stake };
        
        let reward_amount = (((user_stake as u128) * (total_pool_value as u128)) / (total_winning_stake as u128)) as u64;

        // Payout Logic
        let payout = coin::zero<AptosCoin>();
        let real_val = coin::value(&market.real_pool);
        let ai_val = coin::value(&market.ai_pool);
        let remaining_reward = reward_amount;
        
        if (real_val > 0) {
            let take = if (real_val >= remaining_reward) { remaining_reward } else { real_val };
            coin::merge(&mut payout, coin::extract(&mut market.real_pool, take));
            remaining_reward = remaining_reward - take;
        };
        
        if (remaining_reward > 0 && ai_val > 0) {
             let take = if (ai_val >= remaining_reward) { remaining_reward } else { ai_val };
             coin::merge(&mut payout, coin::extract(&mut market.ai_pool, take));
             remaining_reward = remaining_reward - take; // Should be 0 now
        };
        
        coin::deposit(sender_addr, payout);
        table::upsert(&mut market.has_claimed, sender_addr, true);
    }
}
