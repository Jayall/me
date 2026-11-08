var e=`Leetcode_564`,t=`LEETCODE 564 (Solution)`,n=`This document describes a method to solve a hard solution on leetcode (564. The method is to find the next palindrome and the previous palindrome, then compare the distance between the two palindromes and the input number.)`,r=`2024-09`,i=[`Math`,`Palindrome`,`Leetcode`,`C++`,`Problem solving`],a=3,o=[{id:`564-find-the-closest-palindrome-hard-daily`,text:`564. Find the Closest Palindrome [Hard - Daily]`,level:2}],s={},c=`<h2 id="564-find-the-closest-palindrome-hard-daily"><a class="heading-anchor" href="#564-find-the-closest-palindrome-hard-daily" aria-label="Link to this section">#</a>564. Find the Closest Palindrome [Hard - Daily]</h2>
<p><strong>Input</strong> : <span class="note-math-inline" data-math-tex="n" data-display="false"></span> une chaîne représentant un nombre entre <span class="note-math-inline" data-math-tex="0" data-display="false"></span> et <span class="note-math-inline" data-math-tex="10^{18}" data-display="false"></span>, soit <span class="note-math-inline" data-math-tex="N = |n|" data-display="false"></span>.</p>
<p><strong>Problème</strong> : Trouver un palindrome <span class="note-math-inline" data-math-tex="P" data-display="false"></span> différent de <span class="note-math-inline" data-math-tex="n" data-display="false"></span> qui minimise la distance entre <span class="note-math-inline" data-math-tex="P" data-display="false"></span> et <span class="note-math-inline" data-math-tex="n" data-display="false"></span> (en terme de valeur absolue ilay resahina eto).</p>
<p><strong>Solution</strong> :</p>
<p><strong>Observation 1</strong> : Il faut chercher le palindrome akaiky indrindra, c&#39;est-à-dire le prochain palindrome et le précédent palindrome.</p>
<p><strong>Observation 2</strong> : Si on peut juste transformer la chaîne en palindrome et mahafeno an&#39;ireo fepetra ireo ilay izy dia on est bon. Il suffit d&#39;assigner <span class="note-math-inline" data-math-tex="s_{N - i + 1} \\leftarrow s_i" data-display="false"></span>.</p>
<p><strong>Observation 3</strong> : Sinon il faut se salir un peu les mains. Sans perte de généralité, considérons l&#39;algorithme qui va trouver le prochain palindrome <span class="note-math-inline" data-math-tex="P" data-display="false"></span> différent de <span class="note-math-inline" data-math-tex="n" data-display="false"></span>. On supposera alors que <span class="note-math-inline" data-math-tex="P &gt; n" data-display="false"></span>. On le veut le plus proche possible de <span class="note-math-inline" data-math-tex="n" data-display="false"></span>, donc quel indice (puissance de <span class="note-math-inline" data-math-tex="10" data-display="false"></span>) changer ?</p>
<p>Si on choisit un indice <span class="note-math-inline" data-math-tex="i &lt; j &lt; \\frac{N}{2}" data-display="false"></span>, alors en choisissant de modifier <span class="note-math-inline" data-math-tex="i" data-display="false"></span> plutôt que <span class="note-math-inline" data-math-tex="j" data-display="false"></span>, on aura</p>
<div class="note-math-display" data-number="">
  <div class="note-math-body" data-math-tex="P \\leftarrow P + a\\,10^{i - 1} + b\\,10^{N - i}" data-display="true"></div>
  <button class="math-copy" type="button" data-copy-tex="P \\leftarrow P + a\\,10^{i - 1} + b\\,10^{N - i}" aria-label="Copy LaTeX source">copy</button>
</div>
<p>tandis que si on choisit <span class="note-math-inline" data-math-tex="j" data-display="false"></span>, on aura</p>
<div class="note-math-display" data-number="">
  <div class="note-math-body" data-math-tex="P \\leftarrow P + c\\,10^{j - 1} + d\\,10^{N - j}" data-display="true"></div>
  <button class="math-copy" type="button" data-copy-tex="P \\leftarrow P + c\\,10^{j - 1} + d\\,10^{N - j}" aria-label="Copy LaTeX source">copy</button>
</div>
<p>tel que <span class="note-math-inline" data-math-tex="a\\,10^{i - 1} + b\\,10^{N - i} &gt; c\\,10^{j - 1} + d\\,10^{N - j}" data-display="false"></span>. Donc si on choisit <span class="note-math-inline" data-math-tex="i" data-display="false"></span>, on « s&#39;éloigne » plus de <span class="note-math-inline" data-math-tex="n" data-display="false"></span> que si l&#39;on choisit <span class="note-math-inline" data-math-tex="j" data-display="false"></span>.</p>
<p>On peut donc procéder à un algorithme glouton en parcourant d&#39;abord le plus au centre (meilleur local), puis en s&#39;étendant vers les bords. Il est à noter qu&#39;il faut aussi gérer le cas particulier <span class="note-math-inline" data-math-tex="9\\ldots9" data-display="false"></span> (<span class="note-math-inline" data-math-tex="N" data-display="false"></span> fois), pour lequel la réponse est <span class="note-math-inline" data-math-tex="1\\underbrace{0\\ldots0}_{N-1}1" data-display="false"></span>.</p>
<figure class="note-code"><figcaption>Listing · c++</figcaption><pre><code class="language-c++">using ll = long long;

class Solution {
public:
    string nextPalindrome(string s, string&amp; ref)
    {
        int n = s.size();
        for (int i = 0; i &lt; n / 2; i++)
            if (s[i] != s[n - i - 1])
                s[n - i - 1] = s[i];
        if (stoll(s) &gt; stoll(ref))
            return (s);
        int i = n / 2 - (n + 1) % 2;
        while (i &gt;= 0 &amp;&amp; s[i] == &#39;9&#39; &amp;&amp; s[n - i - 1] == &#39;9&#39;)
        {
            s[i] = &#39;0&#39;, s[n - i - 1] = &#39;0&#39;;
            i--;
        }
        if (i &lt; 0) s += &#39;1&#39;, s[++i] = &#39;1&#39;;
        else s[n - i - 1] = ++s[i];
        return (s);
    }

    string previousPalindrome(string s, string&amp; ref)
    {
        int n = s.size();
        for (int i = 0; i &lt; n / 2; i++)
            if (s[i] != s[n - i - 1])
                s[n - i - 1] = s[i];
        if (stoll(s) &lt; stoll(ref))
            return (s);
        int i = n / 2 - (n + 1) % 2;
        while (i &gt;= 0 &amp;&amp; s[i] == &#39;0&#39; &amp;&amp; s[n - i - 1] == &#39;0&#39;)
        {
            s[i] = &#39;9&#39;, s[n - i - 1] = &#39;9&#39;;
            i--;
        }
        if (i &lt; 0) s.pop_back();
        else
        {
            if (!i &amp;&amp; s[i] == &#39;1&#39; &amp;&amp; n &gt; 1) s = string(n - 1, &#39;9&#39;);
            else s[n - i - 1] = --s[i];
        }
        return (s);
    }

    ll distance(string s, string t)
    {
        return abs(stoll(s) - stoll(t));
    }

    string nearestPalindromic(string n) {
        string nxt = nextPalindrome(n, n);
        string prv = previousPalindrome(n, n);
        ll d1 = distance(nxt, n), d2 = distance(prv, n);
        if (d1 == d2) return prv;
        return (d1 &lt; d2) ? nxt : prv;
    }
};</code></pre></figure>`,l={slug:e,title:t,overview:n,date:r,tags:i,readingMinutes:3,headings:o,macros:s,html:c};export{r as date,l as default,o as headings,c as html,s as macros,n as overview,a as readingMinutes,e as slug,i as tags,t as title};