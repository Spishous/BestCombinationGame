class Avatar {
    element;
    constructor(element) {
        element.innerHTML='<div class="avatar-face" data-state="0"><span class="avatar-face-eyes"></span><span class="avatar-face-mouth"></span></div><span class="avatar-back-hair a-hair-color"></span><span class="avatar-hair a-hair-color"></span><div class="avatar-accessory"><div class="avatar-hat"></div><div class="avatar-glass"></div></div>';
        this.element=element;
        this.set_auto_blink(5);
    }
    set_auto_blink(delai){
        let randT=Math.random()*delai+2;
        let act=Math.round(Math.random()*100);
        let e=this;
        setTimeout(function(){
            if(act<65){
                e.eye_blink();
            }else{
                e.act_lookAround();
            }
            e.set_auto_blink(delai);
        },(randT*1000))
    }
    exp_smile(){
        this.element.setAttribute("data-m",1);
    }
    act_lookAround(){
        let e=this.element;
        e.classList.add('look-around');
        setTimeout(function(){
            e.classList.remove('look-around');
        },4000);
    }
    eye_blink(){
        let e=this.element;
        e.classList.add('blink-eyes');
        setTimeout(function(){
            e.classList.remove('blink-eyes');
        },200);
    }

    /**
     * code = FaceColor-Hair-HairColor
     * @returns {number}
     * @param e
     */
    get_data_avatar(e=this.element){
        let code="";
        code=e.getAttribute("data-f");
        code+=e.getAttribute("data-hf");
        code+=e.getAttribute("data-h");
        return code;
    }

    /**
     * code = FaceColor-Hair-HairColor
     * @param code
     * @param e
     * @returns {number}
     */
    set_data_avatar(code,e=this.element){
        code=code.toString();
        e.setAttribute("data-f",code[0]);
        e.setAttribute("data-hf",code[1]);
        e.setAttribute("data-h",code[2]);
    }
    save_data_avatar(e=this.element) {
        localStorage.setItem("avatar-data",this.get_data_avatar(e));
    }
    load_data_avatar() {
        return localStorage.getItem("avatar-data");
    }
}
