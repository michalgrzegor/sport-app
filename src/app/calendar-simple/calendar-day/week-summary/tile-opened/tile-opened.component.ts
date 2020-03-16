import { Component, OnInit, Input } from '@angular/core';
import { Tile } from 'src/app/models/tile';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-tile-opened',
  templateUrl: './tile-opened.component.html',
  styleUrls: ['./tile-opened.component.scss']
})
export class TileOpenedComponent implements OnInit {

  @Input() tile: Tile;
  safeLink: SafeResourceUrl;

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;
  isTabletLand: boolean;
  
  constructor(
    private _sanitizer: DomSanitizer,
    public _breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this._breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isHandset = true;
          this.isTablet = false;
          this.isTabletLand = false;
          this.isWeb = false;
        } else {
        }
      });

    this._breakpointObserver
      .observe([Breakpoints.Tablet])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isHandset = false;
          this.isTablet = true;
          this.isTabletLand = false;
          this.isWeb = false;
        } else {
        }
      });

    this._breakpointObserver
      .observe([Breakpoints.Web])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isHandset = false;
          this.isTablet = false;
          this.isTabletLand = false;
          this.isWeb = true;
        } else {
        }
      });

    this._breakpointObserver
      .observe([Breakpoints.TabletLandscape])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isHandset = false;
          this.isTablet = false;
          this.isTabletLand = true;
          this.isWeb = false;
        } else {
        }
      });

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
