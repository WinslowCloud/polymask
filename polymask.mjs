/**
 * WinslowCloud PolyMask
 * Private codebase, DO NOT DISTRIBUTE
 */
import seedrandom from "seedrandom";


class PolyMask {
    static random_word_list = [
        "aback", "abaft", "abandoned", "abashed", "aberrant", "abhorrent", "abiding", "abject", "ablaze", "able", "abnormal", "aboard", "aboriginal", "abortive", "abounding", "abrasive", "abrupt", "absent", "absorbed", "absorbing", "abstracted", "absurd", "abundant", "abusive", "acceptable", "accessible", "accidental", "accurate", "acid", "acidic", "acoustic", "acrid", "actually", "ad hoc", "adamant", "adaptable", "addicted", "adhesive", "adjoining", "adorable", "adventurous", "afraid", "aggressive", "agonizing", "agreeable", "ahead", "ajar", "alcoholic", "alert", "alike", "alive", "alleged", "alluring", "aloof", "amazing", "ambiguous", "ambitious", "amuck", "amused", "amusing", "ancient", "angry", "animated", "annoyed", "annoying", "anxious", "apathetic", "aquatic", "aromatic", "arrogant", "ashamed", "aspiring", "assorted", "astonishing", "attractive", "auspicious", "automatic", "available", "average", "awake", "aware", "awesome", "awful", "axiomatic", "bad", "barbarous", "bashful", "bawdy", "beautiful", "befitting", "belligerent", "beneficial", "bent", "berserk", "best", "better", "bewildered", "big", "billowy", "bite-sized", "bitter", "bizarre", "black", "black-and-white", "bloody", "blue", "blue-eyed", "blushing", "boiling", "boorish", "bored", "boring", "bouncy", "boundless", "brainy", "brash", "brave", "brawny", "breakable", "breezy", "brief", "bright", "bright", "broad", "broken", "brown"
    ]; //Adjective and Noun only
    constructor(seed, mut_time, domain, available_ports_tcp, available_ports_udp){
        this.seed = seed;
        this.mut_time = mut_time; //Seconds between each mutation
        this.domain = domain;
        this.available_ports_tcp = available_ports_tcp; //Array of available ports, e.g. [80, 443, "8080-8090"];
        //Parse available_ports to array of port numbers
        this.available_ports_tcp = this.available_ports_tcp.map((port) => {
            if(typeof port === "string"){
                let port_range = port.split("-");
                if(port_range.length === 2){
                    let port_range_start = parseInt(port_range[0]);
                    let port_range_end = parseInt(port_range[1]);
                    if(port_range_start < port_range_end){
                        let port_range_array = [];
                        for(let i = port_range_start; i <= port_range_end; i++){
                            port_range_array.push(i);
                        }
                        return port_range_array;
                    }
                }
            }else if(typeof port === "number"){
                return port;
            }
        });
        this.available_ports_tcp = this.available_ports_tcp.flat(Infinity);
        this.available_ports_udp = available_ports_udp; 
        this.available_ports_udp = this.available_ports_udp.map((port) => {
            if(typeof port === "string"){
                let port_range = port.split("-");
                if(port_range.length === 2){
                    let port_range_start = parseInt(port_range[0]);
                    let port_range_end = parseInt(port_range[1]);
                    if(port_range_start < port_range_end){
                        let port_range_array = [];
                        for(let i = port_range_start; i <= port_range_end; i++){
                            port_range_array.push(i);
                        }
                        return port_range_array;
                    }
                }
            }else if(typeof port === "number"){
                return port;
            }
        });
        this.available_ports_udp = this.available_ports_udp.flat(Infinity);
    }
    timestamp(){
        return Math.floor(Date.now() / 1000);
    }
    timestampStable(){
        return Math.floor(Date.now() / 1000  / this.mut_time);
    }
    grpc_path_gen(){
        //Generate random string lengthed between 8 and 16, letter, number only
        let random_string = "";
        let random_string_length = Math.floor(Math.random() * 8) + 8;
        let random = seedrandom(this.seed + this.timestampStable() + "grpc_path_gen");
        for(let i = 0; i < random_string_length; i++){
            let random_char = Math.floor(random() * 62);
            if(random_char < 10){
                random_string += random_char;
            }else if(random_char < 36){
                random_string += String.fromCharCode(random_char + 55);
            }else{
                random_string += String.fromCharCode(random_char + 61);
            }
        }
        return random_string;
    }
    random_domain_gen(){
        /**
         * Generate random domain name using random word list, randomize with seed and mut_time(mut_time determines time between each mutation)
         * e.g. domain = example.com, result could be affix-askew-bikini.example.com
         */
        let random_domain = "";
        let random = seedrandom(this.seed + this.timestampStable() + "random_domain_gen");
        for(let i = 0; i < 3; i++){
            random_domain += PolyMask.random_word_list[Math.floor(random() * PolyMask.random_word_list.length)] + "-";
        }
        random_domain = random_domain.slice(0, -1) + "." + this.domain;
        return random_domain;
    }
    kcp_seed_gen(){
        /*
        * Generate 32 character long random string using seedrandom and timestampStable
        */
        let random_string = "";
        let random_string_length = 32;
        let random = seedrandom(this.seed + this.timestampStable() + "kcp_seed_gen");
        for(let i = 0; i < random_string_length; i++){
            let random_char = Math.floor(random() * 62);
            if(random_char < 10){
                random_string += random_char;
            }else if(random_char < 36){
                random_string += String.fromCharCode(random_char + 55);
            }else{
                random_string += String.fromCharCode(random_char + 61);
            }
        }
        return random_string;
    }
    port_gen(mode){
        /**
         * Select random numbers of ports from available_ports randomly, using seedrandom and timestampStable
         */
        var available_ports;
        if(mode === "tcp"){
            available_ports = this.available_ports_tcp;
        }else if(mode === "udp"){
            available_ports = this.available_ports_udp;
        }
        let random = seedrandom(this.seed + this.timestampStable() + "port_gen");
        let random_port = [];
        let random_port_length = Math.floor(random() * available_ports.length) + 1;
        for(let i = 0; i < random_port_length; i++){
            let random_port_index = Math.floor(random() * available_ports.length);
            random_port.push(available_ports[random_port_index]);
        }
        return random_port;
    }
    single_port_gen(mode){
        /**
         * Select random single port from available_ports randomly, using seedrandom and timestampStable
         */
        var available_ports;
        if(mode === "tcp"){
            available_ports = this.available_ports_tcp;
        }else if(mode === "udp"){
            available_ports = this.available_ports_udp;
        }
        let random = seedrandom(this.seed + this.timestampStable() + "single_port_gen");
        let random_port_index = Math.floor(random() * available_ports.length);
        return available_ports[random_port_index];
    }
    grpc_random_header_gen(){
        /**
         * Generate 64-byte length random base64 string, use Math.random
         */
        let random_header = "";
        let random_header_length = 64;
        for(let i = 0; i < random_header_length; i++){
            let random_char = Math.floor(Math.random() * 62);
            if(random_char < 10){
                random_header += random_char;
            }else if(random_char < 36){
                random_header += String.fromCharCode(random_char + 55);
            }else{
                random_header += String.fromCharCode(random_char + 61);
            }
        }
        return random_header;
    }
}

export default PolyMask;
