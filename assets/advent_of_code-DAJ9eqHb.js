var e=`advent_of_code`,t=`ADVENT OF CODE (Solution)`,n=`This document solves Advent of Code 2024 day 13 by turning the problem into a 2x2 linear system, then solving for each unknown by combining the equations (which amounts to Cramer’s rule).`,r=`2024-09`,i=[`Matrice`,`System of equations`,`Linear algebra`,`Cramer's rule`,`Advent of Code`],a=1,o=[{id:`day-13-advent-of-code`,text:`DAY 13 - ADVENT OF CODE`,level:2}],s={},c=`<h2 id="day-13-advent-of-code"><a class="heading-anchor" href="#day-13-advent-of-code" aria-label="Link to this section">#</a>DAY 13 - ADVENT OF CODE</h2>
<p>On a 2 boutons A et B possédant 2 caractéristiques chacun: <span class="note-math-inline" data-math-tex="k_x" data-display="false"></span> indique que le bouton permet au point de se déplacer <span class="note-math-inline" data-math-tex="k_x" data-display="false"></span> fois sur l&#39;axe des abscisses et <span class="note-math-inline" data-math-tex="k_y" data-display="false"></span> qui indique que le point se déplace <span class="note-math-inline" data-math-tex="k_y" data-display="false"></span> fois sur l&#39;axe des ordonnées.  <br />Le but est de calculer la fonction score <span class="note-math-inline" data-math-tex="f(\\alpha, \\beta) = 3\\alpha + \\beta" data-display="false"></span> pour obtenir le prix situé à <span class="note-math-inline" data-math-tex="(P_x, P_y)" data-display="false"></span> tel qu&#39;on a appuyé <span class="note-math-inline" data-math-tex="\\alpha" data-display="false"></span> fois le bouton A et <span class="note-math-inline" data-math-tex="\\beta" data-display="false"></span> fois le bouton B. <br /><br />Soit le bouton A avec les caractéristiques <span class="note-math-inline" data-math-tex="\\begin{pmatrix}A_x\\\\A_y\\end{pmatrix}" data-display="false"></span> et le bouton B avec les caractéristiques <span class="note-math-inline" data-math-tex="\\begin{pmatrix}B_x\\\\B_y\\end{pmatrix}" data-display="false"></span> <br /><br />Soit alors l&#39;equation suivante:</p>
<div class="note-math-display" data-number="">
  <div class="note-math-body" data-math-tex="\\alpha\\begin{pmatrix}A_x\\\\A_y\\end{pmatrix} + \\beta\\begin{pmatrix}B_x\\\\B_y\\end{pmatrix} = \\begin{pmatrix}P_x\\\\P_y\\end{pmatrix}" data-display="true"></div>
  <button class="math-copy" type="button" data-copy-tex="\\alpha\\begin{pmatrix}A_x\\\\A_y\\end{pmatrix} + \\beta\\begin{pmatrix}B_x\\\\B_y\\end{pmatrix} = \\begin{pmatrix}P_x\\\\P_y\\end{pmatrix}" aria-label="Copy LaTeX source">copy</button>
</div>
<p><br /><br /> Ceci forme le système d&#39;équation suivante:</p>
<div class="note-math-display" data-number="">
  <div class="note-math-body" data-math-tex="\\begin{cases}
    \\alpha A_x + \\beta B_x = P_x\\quad (1)\\\\
    \\alpha A_y + \\beta B_y = P_y \\quad (2)
\\end{cases}" data-display="true"></div>
  <button class="math-copy" type="button" data-copy-tex="\\begin{cases}
    \\alpha A_x + \\beta B_x = P_x\\quad (1)\\\\
    \\alpha A_y + \\beta B_y = P_y \\quad (2)
\\end{cases}" aria-label="Copy LaTeX source">copy</button>
</div>
<p><br />Pour obtenir <span class="note-math-inline" data-math-tex="\\alpha" data-display="false"></span>, on multiplie <span class="note-math-inline" data-math-tex="(1)" data-display="false"></span> par <span class="note-math-inline" data-math-tex="B_y" data-display="false"></span> et <span class="note-math-inline" data-math-tex="(2)" data-display="false"></span> par <span class="note-math-inline" data-math-tex="-B_x" data-display="false"></span>, et on additionne les 2 éxpressions et on obtient alors l&#39;éxpression de <span class="note-math-inline" data-math-tex="\\alpha" data-display="false"></span> suivante:</p>
<div class="note-math-display" data-number="">
  <div class="note-math-body" data-math-tex="\\alpha = \\frac{(B_yP_x - B_xP_y)}{B_yA_x - B_xA_y}" data-display="true"></div>
  <button class="math-copy" type="button" data-copy-tex="\\alpha = \\frac{(B_yP_x - B_xP_y)}{B_yA_x - B_xA_y}" aria-label="Copy LaTeX source">copy</button>
</div>
<p><br /><br />L&#39;expression de <span class="note-math-inline" data-math-tex="\\beta" data-display="false"></span> s&#39;obtient de la meme manière:</p>
<div class="note-math-display" data-number="">
  <div class="note-math-body" data-math-tex="\\beta = \\frac{(A_yP_x - A_xP_y)}{A_yB_x - A_xB_y}" data-display="true"></div>
  <button class="math-copy" type="button" data-copy-tex="\\beta = \\frac{(A_yP_x - A_xP_y)}{A_yB_x - A_xB_y}" aria-label="Copy LaTeX source">copy</button>
</div>`,l={slug:e,title:t,overview:n,date:r,tags:i,readingMinutes:1,headings:o,macros:s,html:c};export{r as date,l as default,o as headings,c as html,s as macros,n as overview,a as readingMinutes,e as slug,i as tags,t as title};