// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// __________                    .___.__               _________         _____   __    
// \______   \_____  __  _  __ __| _/|__|  ____       /   _____/  ____ _/ ____\_/  |_  
//  |    |  _/\__  \ \ \/ \/ // __ | |  |_/ ___\      \_____  \  /  _ \\   __\ \   __\ 
//  |    |   \ / __ \_\     // /_/ | |  |\  \___      /        \(  <_> )|  |    |  |   
//  |______  /(____  / \/\_/ \____ | |__| \___  >    /_______  / \____/ |__|    |__|   
//         \/      \/             \/          \/             \/                        

interface INFTilityExchange {

    function price() external view returns(uint);

    function priceCalculator(uint USDT_) external view returns(uint);

    function NFTilityToken() external view returns(address);

    function USDT() external view returns(address);

}
