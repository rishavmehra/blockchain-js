const Blockchain = require("../blockchain");
const Block = require("../block")

describe("Blockchain", ()=>{
    let blockchain, newChain, originalChain;

    beforeEach(()=>{
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    })
    it("contain the `chain` Array Instance", ()=>{
        expect(blockchain.chain instanceof Array).toBe(true)
    });

    it("Start with genesis Block", ()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    });

    it("add new Block to chain", () => {
        const newData = "Rishav data";
        blockchain.addBlock({data: newData});
    
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData)
    });


    //chain Validation
    describe("isValidChain()", () => {
        describe("When Chain Started without genesis Block", ()=>{
            it("return false", () => {
                blockchain.chain[0] = {data:"demo-data"} 

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
            })
        });

        describe("When Chain started with genesis Block and Multiple blocks", ()=> {
            beforeEach(()=>{
                blockchain.addBlock({data: "data1"})
                blockchain.addBlock({data: "data2"})
                blockchain.addBlock({data: "data3"})
            })
            
            describe("and lastHash refernce has changed", () =>{
                it("return false", ()=>{
                    blockchain.chain[2].lastHash = 'some-garbage-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            });
        
            describe("Chain contain a block with invalid field", () => {
                it(" return false", () => {
                    blockchain.chain[2].data = "some-more-fake-data"
                    
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                });
            });
    
            describe("Chain doesn't contain invaild Blocks", () =>{
                it("return true", ()=>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
                });
            });
        });        
    });

    describe("replaceChain()",()=>{
        let errorMock, logMock;

        beforeEach(()=>{
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        })

        describe("when Chain is not longer", () => {
            beforeEach(()=>{
                newChain.chain[0] = {new : "chain"}
                blockchain.replaceChain(newChain.chain)
            })

            it("dont replace the chain", () =>{    
                expect(blockchain.chain).toEqual(originalChain)

            })
            it("logs an error", ()=>{
                expect(errorMock).toHaveBeenCalled();
            })
        })
    
        describe("When new chain is longer", ()=>{
            beforeEach(()=>{
                newChain.addBlock({data: "data1"})
                newChain.addBlock({data: "data2"})
                newChain.addBlock({data: "data3"})
            })
            describe("chain is invaild",() =>{
                beforeEach(()=>{
                    newChain.chain[2].hash =  "fake-hash"
                    blockchain.replaceChain(newChain.chain)
                })
                it("dont replace the chain", () =>{
                    blockchain.replaceChain(newChain.chain)
                    expect(blockchain.chain).toEqual(originalChain)
                })
                it("logs an error", ()=>{
                    expect(errorMock).toHaveBeenCalled();
                })

            })

            describe("chain is vaild",() =>{
                beforeEach(()=>{blockchain.replaceChain(newChain.chain);})
                it("replaces the chain", () =>{
                    expect(blockchain.chain).toEqual(newChain.chain)                    
                })
                it("logs about chain replacement", ()=>{
                    expect(logMock).toHaveBeenCalled();
                })
            })
        })
    })
});
