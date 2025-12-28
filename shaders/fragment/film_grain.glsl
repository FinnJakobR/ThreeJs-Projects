float generateGrain(){
    float amount = 0.18;


    //der hash ist relative (wiederholt sich realtiv schnell das pattern) klein da muss man nochmal nen besseren Hash suchen

    float randomIntensity = fract(
    sin(dot(vec2(gl_FragCoord.x, gl_FragCoord.y) * (time / 400.00),
            vec2(12.9898,78.233)))
    * 43758.5453398398
);
      // fract
      //   ( 10000
      //   * sin
      //       (
      //         ( gl_FragCoord.x
      //         + gl_FragCoord.y
      //         * time
      //         )
      //       * 4.00
      //       )
      //   );

    amount *= randomIntensity;

    return amount;

}