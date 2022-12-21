# TokenPriceAggregator
##Problems
- When dealing with vault or farm, it's not uncommon to get the price of the underlying token whether single token or LP pair. 
- While ChainLink is a viable option out there but its oracle covers a limited list of tokens on supported chains. 
- Therefore, to get the underlying asset price, we need more than the Chainlink Oracle such as using hosting TWAP oracle contract to get the price of single token or expand to the price of LP pair. 
- If you are not careful, the next thing you know you'll have different ways to get the price of underlying tokens. 
##Solution
- Create a factory called TokenPriceAggregator with standardized func to get the underlying price of asset against USD 
- Plug in supporting contracts for Chainlink or TWAP or LP Pricing.
