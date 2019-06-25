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


    it('Check if it doesnot set to some other totalSupplyValue',function(){
        return HokageToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),10000000,'sets the total supply to 1000000');
        });
    });

})