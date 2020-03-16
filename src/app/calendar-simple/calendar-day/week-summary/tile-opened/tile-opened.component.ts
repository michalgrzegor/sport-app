import { Component, OnInit, Input } from '@angular/core';
import { Tile } from 'src/app/models/tile';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tile-opened',
  templateUrl: './tile-opened.component.html',
  styleUrls: ['./tile-opened.component.scss']
})
export class TileOpenedComponent implements OnInit {

  @Input() tile: Tile;
  safeLink: SafeResourceUrl;
  
  constructor(
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    //youtube link sanitizing
    if(this.tile.tile_type === 'motivation' && this.tile.tile_motivation.tile_motivation_link){
      let link = this.tile.tile_motivation.tile_motivation_link;
      if(link.includes('watch?v=')){
        link = link.replace('watch?v=', 'embed/')
      }
      this.safeLink = this._sanitizer.bypassSecurityTrustResourceUrl(link);
    }
    this.tile = Object.assign({}, this.tile); 

    //changing tiles key from null to '' | need for shorten subtitles

    if(this.tile.tile_type === 'training' && this.tile.tile_activities.length > 0){
      if(this.tile.tile_activities[0].tile_activity_name === null){this.tile.tile_activities[0].tile_activity_name = ''};
    }

    if(this.tile.tile_type === 'diet' && this.tile.tile_diets.length > 0){
      if(this.tile.tile_diets[0].tile_diet_meal === null){this.tile.tile_diets[0].tile_diet_meal=''}
    }

    if(this.tile.tile_type === 'question' && this.tile.tile_question.tile_ask_question === null){this.tile.tile_question.tile_ask_question=''};

    if(this.tile.tile_type === 'motivation' && this.tile.tile_motivation.tile_motivation_sentence === null){this.tile.tile_motivation.tile_motivation_sentence=''};
  }

}
