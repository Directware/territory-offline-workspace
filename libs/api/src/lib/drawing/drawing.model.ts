import {PrintConfiguration} from './print-configuration.model';
import {FeatureCollection, Geometry} from '@turf/turf';
import {TimedEntity} from "@territory-offline-workspace/api";

export interface Drawing extends TimedEntity
{
  featureCollection: FeatureCollection<Geometry>;
  printConfiguration?: PrintConfiguration;
}
