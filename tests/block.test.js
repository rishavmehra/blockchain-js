const Block = require("../block")
const { GENESIS_DATA } = require("../config")
const cryptoHash = require("../crypto-hash")

describe('Block', () =>{
    const timestamp = "a-time"
    const lastHash = "foo-lasthash"
    const hash = "foo-hash"
    const data = ['Blockchain', 'data']
    const block = new Block({timestamp, lastHash, hash, data})

    it('has-time, lasthash, hash, and data', ()=>{
        expect(block.timestamp).toEqual(timestamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
    });

    describe('genesis()' ,()=>{
        const genesisBlock = Block.genesis();

        it("return a Block instance", ()=>{
            expect(genesisBlock instanceof Block).toBe(true)
        });

        it("return a genesis instance", ()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA)
        });

    });

    describe('mineBlock', ()=>{
        const lastBlock = Block.genesis();
        const data = 'mine data';
        const minedBlock = Block.mineBlock({lastBlock, data}) 
        
        it('return a Block instance', ()=>{
            expect(minedBlock instanceof Block).toBe(true)
        });

        it('sets the `lasthash` to be the `hash` of the lastblock', ()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash)
        });

        it('set the `data`', ()=>{
            expect(minedBlock.data).toEqual(data)
        });

        it("sets a `timestamp`", ()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined)
        });

        it("check the mined hash", ()=>{
            expect(minedBlock.hash)
            .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data))
        });
    })
})