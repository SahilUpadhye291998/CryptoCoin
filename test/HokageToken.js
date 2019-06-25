var HokageToken = artifacts.require("HokageToken");

contract('HokageToken', function(accounts){

    it('sets the supply at the time of deployment',function(){
        return HokageToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),1000000,'sets the total supply to 1000000');
        });
    });

    it('see if the balance of admin is set',function(){
        return HokageToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),1000000,'It sets the balance of the admin perfetly');
        });
    });

    it('see if name, symbol and standered are up to date',function(){
        return HokageToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,'HokageToken','name is coorectly set');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,'Hokage','symbol is coorectly set');
            return tokenInstance.standered();
        }).then(function(standered){
            assert.equal(standered,'HokageToken v1.0','standered is at current version');            
        }); 
    });

    it('test function',function(){
        return HokageToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.testFunction.call(666);
        }).then(function(test){
            assert.equal(test,true,"OK");
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,'Hokage','symbol is coorectly set');            
        }).catch(function(error){
            console.error(error);
        });
    })


    it('see if transfer function is working or not',function(){
        return HokageToken.deployed().then(function(instance) {
            tokenInstance = instance;
            // Test `require` statement first by transferring something larger than the sender's balance   
            return tokenInstance.transfer.call(accounts[1], 999999);
          }).then(assert.pass).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
          }).then(function(success) {
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
          }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
          }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0]);
          }).then(function(balance) {
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
          });
    });

    
});


//.call will not create any transaction while
// directing calling the function will result in the transactions